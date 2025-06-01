"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  console.log(password, email, name);
  const handleSignUp = async () => {
    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: (ctx:any) => {
          //show loading
        },
        onSuccess: (ctx:any) => {
          alert("Sign up successful!"); // display success message
        },
        onError: (ctx) => {
          // display the error message
          // alert(ctx.error.message);
        },
      }
    );
    console.log(error, data);
  };
  return (
    <div>
      <h1>Sign Up</h1>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <Button onClick={handleSignUp}>Sign Up</Button>
    </div>
  );
}
