const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// ==========================
// EMAIL DE VERIFICAÇÃO
// ==========================

async function enviarEmailVerificacao(email, nome, token) {
    try {

        console.log("Entrou na função enviarEmailVerificacao");

        const link = `${process.env.APP_URL}/usuarios/verificar/${token}`;

        console.log("Link:", link);
        console.log("Enviando para:", email);

        const resposta = await resend.emails.send({
            from: "Seu App <onboarding@resend.dev>",
            to: email,
            subject: "Confirme seu email ❤️",
            html: `
                <h1>Olá ${nome}</h1>

                <p>Obrigado por criar sua conta.</p>

                <a href="${link}">
                    Confirmar Email
                </a>
            `
        });

        console.log("RESPOSTA DO RESEND:");
        console.log(resposta);

    } catch (error) {

        console.log("ERRO AO ENVIAR EMAIL:");
        console.log(error);

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