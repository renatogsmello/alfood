import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useEffect, useState } from "react"
import IRestaurante from "../../../interfaces/IRestaurante"
import axios from "axios"
import { Link } from "react-router-dom"

export default function AdministracaoRestaurantes() {
	const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])

	useEffect(() => {
		axios.get<IRestaurante[]>("http://localhost:8000/api/v2/restaurantes/").then((resposta) => setRestaurantes(resposta.data))
	}, [])

	const excluir = (item: IRestaurante) => {
		axios.delete(`http://localhost:8000/api/v2/restaurantes/${item.id}/`).then(() => {
			const listaRestaurantes = restaurantes.filter((restaurante) => restaurante.id !== item.id)
			setRestaurantes([...listaRestaurantes])
		})
	}
	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Nome</TableCell>
						<TableCell>Editar</TableCell>
						<TableCell>Excluir</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{restaurantes.map((restaurante) => (
						<TableRow key={restaurante.id}>
							<TableCell>{restaurante.nome}</TableCell>
							<TableCell>
								[<Link to={`/admin/restaurantes/${restaurante.id}`}>Editar</Link>]
							</TableCell>
							<TableCell>
								<Button variant="outlined" color="error" onClick={() => excluir(restaurante)}>
									Excluir
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
