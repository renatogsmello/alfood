import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import IPrato from "../../../interfaces/IPrato"
import http from "../../../http"
import ITag from "../../../interfaces/ITag"
import IRestaurante from "../../../interfaces/IRestaurante"

export default function FormularioPrato() {
	const [nomePrato, setNomePrato] = useState("")
	const [descricao, setDescricao] = useState("")
	const [tags, setTags] = useState<ITag[]>([])
	const [tag, setTag] = useState("")
	const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
	const [restaurante, setRestaurante] = useState("")
	const [imagem, setImagem] = useState<File | null>(null)

	const parametros = useParams()

	useEffect(() => {
		if (parametros.id) {
			http.get<IPrato>(`pratos/${parametros.id}/`).then((resposta) => setNomePrato(resposta.data.nome))
		}
	}, [parametros])

	useEffect(() => {
		http.get<{ tags: ITag[] }>("tags/").then((resposta) => setTags(resposta.data.tags))
		http.get<IRestaurante[]>("/restaurantes/").then((resposta) => setRestaurantes(resposta.data))
	}, [])

	const SelecionaArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
		if (evento.target.files?.length) {
			setImagem(evento.target.files[0])
		} else {
			setImagem(null)
		}
	}

	const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
		evento.preventDefault()

		const formData = new FormData()
		formData.append("nome", nomePrato)
		formData.append("tag", tag)
		formData.append("descricao", descricao)
		formData.append("restaurante", restaurante)
		if (imagem) {
			formData.append("imagem", imagem)
		}

		http.request({
			url: "pratos/",
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
			},
			data: formData,
		})
			.then(() => {
				setNomePrato("")
				setDescricao("")
				setTag("")
				setRestaurante("")
				alert("Prato cadastrado com sucesso!")
			})
			.catch((erro) => console.log(erro))
	}

	return (
		<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
			<Typography component="h1" variant="h6">
				Formulário de Pratos
			</Typography>
			<Box component="form" sx={{ width: "100%" }} onSubmit={aoSubmeterForm}>
				<TextField
					onChange={(evento) => setNomePrato(evento.target.value)}
					label="Nome do Prato"
					value={nomePrato}
					variant="standard"
					fullWidth
					required
					margin="dense"
				/>
				<TextField
					onChange={(evento) => setDescricao(evento.target.value)}
					label="Descrição"
					value={descricao}
					variant="standard"
					fullWidth
					required
					margin="dense"
				/>
				<FormControl margin="dense" fullWidth>
					<InputLabel id="select-tag">Tag</InputLabel>
					<Select labelId="select-tag" value={tag} onChange={(evento) => setTag(evento.target.value)}>
						{tags.map((tag) => (
							<MenuItem key={tag.id} value={tag.value}>
								{tag.value}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl margin="dense" fullWidth>
					<InputLabel id="select-restaurante">Restaurante</InputLabel>
					<Select labelId="select-restaurante" value={restaurante} onChange={(evento) => setRestaurante(evento.target.value)}>
						{restaurantes.map((restaurante) => (
							<MenuItem key={restaurante.id} value={restaurante.id}>
								{restaurante.nome}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<input type="file" onChange={SelecionaArquivo} />
				<Button sx={{ marginTop: 1 }} type="submit" variant="outlined" fullWidth>
					Salvar
				</Button>
			</Box>
		</Box>
	)
}
