import { useRouter } from "next/router";
import dynamic from 'next/dynamic'
export default function Login() {
    const router = useRouter()
    let links = router.asPath.split('/')
    let template = links.length > 3 ? "registerForm" : "loginForm"
    const Component = dynamic(
        () => import(`../components/auth/${template}.js`)
    )
    return (<Component />)
}