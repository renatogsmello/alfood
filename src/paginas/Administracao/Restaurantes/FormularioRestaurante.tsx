import { Box, Button, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import IRestaurante from "../../../interfaces/IRestaurante"
import http from "../../../http"

export default function FormularioRestaurante() {
	const [nomeRestaurante, setNomeRestaurante] = useState("")

	const parametros = useParams()

	useEffect(() => {
		if (parametros.id) {
			http.get<IRestaurante>(`restaurantes/${parametros.id}/`).then((resposta) => setNomeRestaurante(resposta.data.nome))
		}
	}, [parametros])

	const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
		evento.preventDefault()
		console.log("quero enviar dados para api:")
		console.log(nomeRestaurante)

		if (parametros.id) {
			http.put(`restaurantes/${parametros.id}/`, { nome: nomeRestaurante }).then(() => alert("Restaurante atualizado com sucesso!"))
		} else {
			http.post("restaurantes/", { nome: nomeRestaurante }).then(() => alert("Restaurante cadastrado com sucesso!"))
		}
	}

	return (
		<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
			<Typography component="h1" variant="h6">
				Formulário de Restaurantes
			</Typography>
			<Box component="form" onSubmit={aoSubmeterForm}>
				<TextField
					onChange={(evento) => setNomeRestaurante(evento.target.value)}
					label="Nome do Restaurante"
					value={nomeRestaurante}
					variant="standard"
					fullWidth
					required
				/>
				<Button sx={{ marginTop: 1 }} type="submit" variant="outlined" fullWidth>
					Salvar
				</Button>
			</Box>
		</Box>
	)
}
