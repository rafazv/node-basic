const axios = require('axios')
const moment = require('moment')
const conexao = require('../infraestrutura/database/conexao')
const repositorio = require('../repositorios/atendimento')

class Atendimento {
    constructor() {
        this.dataValida = ({data, dataCriacao}) => moment(data).isSameOrAfter(dataCriacao)
        this.clienteValido = (tamanho) => tamanho >= 5
        this.valida = parametros => this.validacoes.filter(
            campo => {
                const { nome } = campo
                const parametro = parametros[nome]

                return !campo.valido(parametro)
            }
        )
        this.validacoes = [
            {
                nome: 'data',
                valido: this.dataValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: this.clienteValido,
                mensagem: 'cliente deve ter pelo menos cinco caracteres'
            }
        ]
    }

    adiciona(atendimento) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')

        const parametros = {
            data: { data, dataCriacao },
            cliente: { tamanho: atendimento.cliente.length }
        }

        const erros = this.valida(parametros)
        const existemErros = erros.length

        if(existemErros) {
            return new Promise((reject) => reject(erros))
        } else {
            const atendimentoDatado = {...atendimento, dataCriacao, data}
    
            return repositorio.adiciona(atendimentoDatado)
                .then(resultados => {
                    const id = resultados.insertId
                    return ({...atendimento, id})
                })
        }
    }

    lista() {
        return repositorio.lista()
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`

        const cpf = atendimento.cliente

        conexao.query(sql, async (erro, resultados) => {
            const atendimento = resultados[0]
            if(erro) {
                res.status(400).json(erro)
            } else {
                const { data } = await axios.get(`http://localhost:8082/${cpf}`)
                atendimento.cliente = data
                res.status(200).json(atendimento)
            }
        })
    }

    altera(id, valores, res) {
        if(valores.data) {
            valores.data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
        }

        const sql = 'UPDATE Atendimentos SET ? WHERE id=?'

        conexao.query(sql, [valores, id], (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({...valores, id})
            }
        })
    }

    deleta(id, res) {
        const sql = 'DELETE FROM Atendimentos WHERE id=?'

        conexao.query(sql, id, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({id})
            }
        })
    }
}

module.exports = new Atendimento