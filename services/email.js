const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// ==========================
// EMAIL DE VERIFICAÇÃO
// ==========================

async function enviarEmailVerificacao(email, nome, token) {

    try {

        const link = `${process.env.APP_URL}/usuarios/verificar/${token}`;

        const resposta = await resend.emails.send({

            from: 'Seu App <onboarding@resend.dev>',

            to: email,

            subject: 'Confirme seu email ❤️',

            html: `

            <h1>Olá ${nome}!</h1>

            <p>
            Obrigado por criar sua conta.
            </p>

            <p>
            Clique abaixo para confirmar seu email:
            </p>

            <a href="${link}"

            style="
            background:#E11D48;
            color:white;
            padding:12px 20px;
            border-radius:8px;
            text-decoration:none;
            ">

            Confirmar Email

            </a>

            `

        });

        console.log('EMAIL VERIFICAÇÃO ENVIADO:');
        console.log(resposta);

    } catch (erro) {

        console.error('ERRO AO ENVIAR EMAIL DE VERIFICAÇÃO:');
        console.error(erro);

    }

}

// ==========================
// EMAIL RESET SENHA
// ==========================

async function enviarEmailReset(email, nome, token) {

    try {

        const link =
        `${process.env.APP_URL}/usuarios/resetar-senha/${token}`;

        const resposta = await resend.emails.send({

            from: 'Seu App <onboarding@resend.dev>',

            to: email,

            subject: 'Recuperação de senha 🔐',

            html: `

            <h1>Olá ${nome}!</h1>

            <p>
            Recebemos uma solicitação para alterar sua senha.
            </p>

            <p>
            Clique abaixo para criar uma nova senha:
            </p>

            <a href="${link}"

            style="
            background:#001eff;
            color:white;
            padding:12px 20px;
            border-radius:8px;
            text-decoration:none;
            ">

            Redefinir Senha

            </a>

            <p>
            Esse link expira em 10 minutos.
            </p>

            `

        });

        console.log('EMAIL RESET ENVIADO:');
        console.log(resposta);

    } catch (erro) {

        console.error('ERRO AO ENVIAR EMAIL RESET:');
        console.error(erro);

    }

}

module.exports = {

    enviarEmailVerificacao,

    enviarEmailReset

};