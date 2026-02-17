import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

// Pulling API data
import { useAtomValue } from "jotai";
import { domainAtom, usernameAtom } from "@/helpers/state";


export default function RegistrationSuccessMethod() {
    const domain = useAtomValue(domainAtom);
    const idpName =
        domain?.idps && domain.idps.length > 0
            ? domain.idps[0].displayName
            : "ACCESS CI (XSEDE)";
    const username = useAtomValue(usernameAtom);
    console.log(idpName);

    return (
        <div>
            <h1 className="mb-4">ACCESS Registration</h1>
            <div className="mb-4 flex">
                <Card>
                    <div className="p-6">
                        <p className="font-semibold">  Your new ACCESS ID is <span className="text-primary font-bold"> {username} </span> </p>
                        <p> To log in to ACCESS: </p>
                        <ul className="list-disc pl-6">
                            <li> Select <span className="text-primary"> {idpName} </span> as your identity provider </li>
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