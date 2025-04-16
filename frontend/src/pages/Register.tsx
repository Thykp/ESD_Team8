import { Navbar } from "@/components/blocks/Navbar"
import { RegisterForm } from "@/components/blocks/RegisterForm"

export default function Register() {
    return (
        <>
            <Navbar />
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <RegisterForm />
                </div>
            </div>
        </>
    )
}
