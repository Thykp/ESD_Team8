import { LoginForm } from "@/components/blocks/LoginForm"
import { Navbar } from "@/components/blocks/Navbar"

export default function Login() {
    return (
        <>
            <Navbar />
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm />
                </div>
            </div>
        </>
    )
}
