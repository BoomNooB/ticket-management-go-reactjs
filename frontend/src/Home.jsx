import axios from "axios";
import React, { useEffect, useState } from "react";

const Home = () => {
	const [tickets, setTickets] = useState([]);

	useEffect(() => {
		fetchTickets();
	}, []);

	const fetchTickets = async () => {
		try {
			const response = await axios.get("/tickets");
			const data = response.data;

			const formattedData = data.map((ticket) => ({
				...ticket,
				createdAt: new Date(ticket.createdAt).toLocaleString(),
				updatedAt: new Date(ticket.updatedAt).toLocaleString(),
			}));

			setTickets(formattedData);
		} catch (error) {
			console.error("Failed to fetch tickets:", error);
		}
	};

	return (
		<div>
			<h1 className="text-center">Ticket Management System</h1>

			<table className="table table-striped">
				<thead>
					<tr>
						<th>Title</th>
						<th>Description</th>
						<th>Contact</th>
						<th>Information</th>
						<th>Created</th>
						<th>Updated</th>
					</tr>
				</thead>
				<tbody>
					{tickets.map((ticket) => (
						<tr key={ticket.id}>
							<td>{ticket.title}</td>
							<td>{ticket.description}</td>
							<td>{ticket.contactInfo}</td>
							<td>{ticket.status}</td>
							<td>{ticket.createdAt}</td>
							<td>{ticket.updatedAt}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Home;
