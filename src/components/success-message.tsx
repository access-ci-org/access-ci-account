import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export default function SuccessMessage() {
    return (
        <div>
            <h1>ACCESS Registration</h1>
            <div className="mb-4 flex">
                <Card className="w-full" style={{ backgroundColor: "#ecf9f8" }}>
                    <div className="p-4">
                        <p> <strong> Your new ACCESS ID is: {/* Display the ACCESS ID here */}</strong></p>
                        <p> To log in to ACCESS: </p>
                        <ul>
                            <li> Select { /* idp  */} as your identity provider </li>
                        </ul>
                        <Button asChild className="bg-primary mt-4 align-center">
                            <Link to="/login">Login</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        </div>

    )
}