"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Register() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const router = useRouter();

	const register = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await axios.post(
				"http://localhost:4000/api/auth/register",
				{ email, password },
				{ withCredentials: true }
			);
			alert("Registered! You can now login.");
			router.push("/login");
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				alert(err.response?.data?.message || "Registration error");
			} else {
				alert("An unknown error occurred");
			}
		}
	};

	return (
		<form onSubmit={register}>
			<h1>Register</h1>
			<input
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
			<button type="submit">Register</button>
		</form>
	);
}
