"use client";
import { useRouter } from "next/navigation";
import { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";

export default function Login() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const router = useRouter();

	const login = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await axios.post(
				"http://localhost:4000/api/auth/login",
				{ email, password },
				{ withCredentials: true }
			);
			router.push("/dashboard");
		} catch (err: any) {
			alert(err.response?.data?.message || "Login error");
		}
	};

	return (
		<form onSubmit={login}>
			<h1>Login</h1>
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e: ChangeEvent<HTMLInputElement>) =>
					setEmail(e.target.value)
				}
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e: ChangeEvent<HTMLInputElement>) =>
					setPassword(e.target.value)
				}
			/>
			<button type="submit">Login</button>
		</form>
	);
}
