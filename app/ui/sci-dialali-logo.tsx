import Image from "next/image";

export default function SCIDialaliLogo() {
    return (
        <Image
            src="/logo.svg"
            width={250}
            height={100}
            alt="Company Logo"
        />
    );
}