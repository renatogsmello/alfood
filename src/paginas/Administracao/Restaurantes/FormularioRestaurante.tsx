import { Button, TextField } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import IRestaurante from "../../../interfaces/IRestaurante"

export default function FormularioRestaurante() {
	const [nomeRestaurante, setNomeRestaurante] = useState("")

	const parametros = useParams()

	useEffect(() => {
		if (parametros.id) {
			axios.get<IRestaurante>(`http://localhost:8000/api/v2/restaurantes/${parametros.id}/`).then((resposta) => setNomeRestaurante(resposta.data.nome))
		}
	}, [parametros])

	const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
		evento.preventDefault()
		console.log("quero enviar dados para api:")
		console.log(nomeRestaurante)

		if (parametros.id) {
			axios
				.put(`http://localhost:8000/api/v2/restaurantes/${parametros.id}/`, { nome: nomeRestaurante })
				.then(() => alert("Restaurante atualizado com sucesso!"))
		} else {
			axios.post("http://localhost:8000/api/v2/restaurantes/", { nome: nomeRestaurante }).then(() => alert("Restaurante cadastrado com sucesso!"))
		}
	}

	return (
		<form onSubmit={aoSubmeterForm}>
			<TextField onChange={(evento) => setNomeRestaurante(evento.target.value)} label="Nome do Restaurante" value={nomeRestaurante} variant="standard" />
			<Button type="submit" variant="outlined">
				Salvar
			</Button>
		</form>
	)
}
