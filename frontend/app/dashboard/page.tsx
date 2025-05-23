"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
	email: string;
}

export default function Dashboard() {
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	useEffect(() => {
		axios
			.get<User>("http://localhost:4000/api/auth/me", { withCredentials: true })
			.then((res) => setUser(res.data))
			.catch(() => router.push("/login"));
	}, [router]);

	const logout = async () => {
		await axios.post(
			"http://localhost:4000/api/auth/logout",
			{},
			{ withCredentials: true }
		);
		router.push("/login");
	};

	if (!user) return <p>Loading...</p>;

	return (
		<div>
			<h1>Dashboard</h1>
			<h1>&nbsp;</h1>
			<h2>Welcome, {user.email}</h2>
			<div>&nbsp;</div>
			<button onClick={logout}>Logout</button>
		</div>
	);
}
