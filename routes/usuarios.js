const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const db = require('../database/db');

const {
    enviarEmailVerificacao,
    enviarEmailReset
} = require('../services/email');


const JWT_SECRET = process.env.JWT_SECRET;




function validarEmail(email){

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);

}






// ==========================
// CADASTRO
// ==========================


router.post('/cadastro', async(req,res)=>{


try{


const {
    nome,
    email,
    senha
} = req.body;



if(!nome || !email || !senha){

return res.status(400).json({

mensagem:'Preencha todos os campos.'

});

}




if(!validarEmail(email)){


return res.status(400).json({

mensagem:'Email inválido.'

});


}




if(senha.length < 8){


return res.status(400).json({

mensagem:'A senha deve ter no mínimo 8 caracteres.'

});


}





const [existe] = await db.execute(

'SELECT id FROM usuarios WHERE email = ?',

[email]

);



if(existe.length > 0){

return res.status(400).json({

mensagem:'Email já cadastrado.'

});

}





const senhaHash = await bcrypt.hash(

senha,

10

);




const token = crypto

.randomBytes(32)

.toString('hex');






await db.execute(

`

INSERT INTO usuarios

(
nome,
email,
senha,
email_verificado,
token_verificacao
)

VALUES (?,?,?,?,?)

`

,

[

nome,

email,

senhaHash,

false,

token

]

);

console.log("==================================");
console.log("INICIANDO ENVIO DO EMAIL");
console.log("Nome:", nome);
console.log("Email:", email);
console.log("Token:", token);

await enviarEmailVerificacao(
    email,
    nome,
    token
);

console.log("FUNÇÃO enviarEmailVerificacao FINALIZADA");
console.log("==================================");


res.status(201).json({

mensagem:'Cadastro realizado. Verifique seu email.'

});





}catch(error){


console.log(error);


res.status(500).json({

mensagem:'Erro no servidor.'

});


}


});








// ==========================
// VERIFICAR EMAIL
// ==========================


router.get('/verificar/:token', async(req,res)=>{


try{


const {token} = req.params;



const [usuarios] = await db.execute(

`

SELECT id

FROM usuarios

WHERE token_verificacao = ?

`

,

[token]

);




if(usuarios.length === 0){

return res.send(

'Token inválido.'

);

}





await db.execute(

`

UPDATE usuarios

SET

email_verificado = true,

token_verificacao = NULL

WHERE token_verificacao = ?

`

,

[token]

);





res.send(

'Email confirmado com sucesso!'

);




}catch(error){


console.log(error);


res.status(500).send(

'Erro ao verificar email.'

);


}



});








// ==========================
// LOGIN
// ==========================


router.post('/login', async(req,res)=>{
    console.log('LOGIN RECEBIDO');
    console.log(req.body);

try{


const {

email,

senha

}=req.body;





const [usuarios] = await db.execute(

'SELECT * FROM usuarios WHERE email = ?',

[email]

);





if(usuarios.length === 0){


return res.status(401).json({

mensagem:'Email ou senha inválidos.'

});


}





const usuario = usuarios[0];





if(!usuario.email_verificado){


return res.status(401).json({

mensagem:'Confirme seu email antes de entrar.'

});


}






const senhaCorreta = await bcrypt.compare(

senha,

usuario.senha

);





if(!senhaCorreta){


return res.status(401).json({

mensagem:'Email ou senha inválidos.'

});


}





const token = jwt.sign(

{

id:usuario.id,

nome:usuario.nome,

email:usuario.email

},

JWT_SECRET,

{

expiresIn:'7d'

}

);






res.json({

id:usuario.id,

nome:usuario.nome,

email:usuario.email,

token

});





}catch(error){


console.log(error);


res.status(500).json({

mensagem:'Erro no servidor.'

});


}


});

// ==========================
// ESQUECI MINHA SENHA
// ==========================


router.post('/esqueci-senha', async(req,res)=>{


try{


const {email} = req.body;



const [usuarios] = await db.execute(

'SELECT id,nome FROM usuarios WHERE email = ?',

[email]

);




// Não informa se o email existe ou não

if(usuarios.length === 0){


return res.json({

mensagem:'Se o email existir, enviaremos um link de recuperação.'

});


}




const usuario = usuarios[0];





const token = crypto

.randomBytes(32)

.toString('hex');






const expiracao = new Date();


expiracao.setMinutes(

expiracao.getMinutes() + 10

);







await db.execute(

`

UPDATE usuarios

SET

reset_token = ?,

reset_token_expira = ?

WHERE id = ?

`

,

[

token,

expiracao,

usuario.id

]

);








await enviarEmailReset(

email,

usuario.nome,

token

);







res.json({

mensagem:'Email de recuperação enviado.'

});





}catch(error){


console.log(error);


res.status(500).json({

mensagem:'Erro no servidor.'

});


}


});









// ==========================
// ABRIR LINK DO RESET
// ==========================
// Essa rota existe para o clique no Gmail
// (o navegador faz GET)


router.get('/resetar-senha/:token', async(req,res)=>{


try{


const {token} = req.params;




const [usuarios] = await db.execute(

`

SELECT id

FROM usuarios

WHERE reset_token = ?

AND reset_token_expira > NOW()

`

,

[token]

);







if(usuarios.length === 0){


return res.send(`


<h1>
Link inválido ou expirado ❌
</h1>


`);


}






res.send(`


<html>


<head>

<title>
Redefinir senha
</title>


</head>



<body style="

font-family:Arial;

text-align:center;

margin-top:80px;

">



<h1>
Recuperação de senha 🔐
</h1>



<p>
Seu link está válido.
</p>



<p>
Abra o aplicativo para criar uma nova senha.
</p>



</body>


</html>



`);





}catch(error){


console.log(error);


res.status(500).send(

'Erro no servidor.'

);


}



});











// ==========================
// ALTERAR SENHA
// ==========================


router.post('/resetar-senha/:token', async(req,res)=>{


try{


const {token} = req.params;


const {novaSenha} = req.body;






if(!novaSenha || novaSenha.length < 8){


return res.status(400).json({

mensagem:'A senha deve ter no mínimo 8 caracteres.'

});


}






const [usuarios] = await db.execute(

`

SELECT id

FROM usuarios

WHERE reset_token = ?

AND reset_token_expira > NOW()

`

,

[token]

);






if(usuarios.length === 0){


return res.status(400).json({

mensagem:'Token inválido ou expirado.'

});


}






const senhaHash = await bcrypt.hash(

novaSenha,

10

);






await db.execute(

`

UPDATE usuarios

SET

senha = ?,

reset_token = NULL,

reset_token_expira = NULL

WHERE id = ?

`

,

[

senhaHash,

usuarios[0].id

]

);







res.json({

mensagem:'Senha alterada com sucesso!'

});







}catch(error){


console.log(error);


res.status(500).json({

mensagem:'Erro no servidor.'

});


}


});









module.exports = router;