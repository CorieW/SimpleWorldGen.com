import './Nav.scss'
import useStore from '../../ts/appStore'

type Props = {}

export default function Nav({}: Props) {
    const { account } = useStore()

    const nonUserJSX = (
        <ul>
            <li><button>Sign Up</button></li>
            <li><button>Login</button></li>
        </ul>
    )

    const userJSX = (
        <ul>
            <li><button>Logout</button></li>
        </ul>
    )

    return (
        <div id='nav'>
            <h1><a href='/'>SimpleWorldGen.com</a></h1>
            {account ? userJSX : nonUserJSX}
        </div>
    )
}