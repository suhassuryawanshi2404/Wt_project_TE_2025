
import { useRouter } from "next/navigation";

export default function Register() {
    const router = useRouter();
    return (
        <button className='flex items-center gap-1 h-12 bg-blue-400 hover:bg-blue-300 active:bg-blue-800 px-2 py-1 rounded-md ' onClick={() => {
            router.push('/sign-in')
        }}>
            <span className='text-black'>Register</span>
            <img src='/arrow.png' alt='get_started_arrow' className='h-4 w-4' />
        </button>
    )
}