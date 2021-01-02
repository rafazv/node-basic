const fs = require('fs')
const path = require('path')

module.exports = (caminho, nomeArquivo, callbackImagemCriada) => {

    const tiposValidos = ['jpg', 'png', 'jpeg']
    const tipo = path.extname(caminho)
    const tipoEhValido = tiposValidos.indexOf(tipo.substring(1)) !== -1

    if(!tipoEhValido) {
        const erro = "Tipo é inválido"
        console.log("Erro! Tipo inválido")
        callbackImagemCriada(erro)
    } else {
        const novoCaminho = `./assets/imagens/${nomeArquivo}${tipo}`
    
        fs.createReadStream(caminho)
            .pipe(fs.createWriteStream(novoCaminho))
            .on('finish', () => callbackImagemCriada(false, novoCaminho))
    }
}
