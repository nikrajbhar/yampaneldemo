

import Dashboard from "./dashboard";
import Login from "./login";
import { useSelector, useDispatch } from "react-redux";
import { parseCookies } from 'nookies'
import { useEffect, useState } from "react"; 
import { clearLoginData } from "../redux/actions/userAction";

export default function Home(props) {

	const [tokenValid, settokenValid] = useState(true)
	const dispatch = useDispatch()
	var { token } = props
	useEffect(() => {
		if (!token) {
			settokenValid(false)
			dispatch(clearLoginData())
		}
	},[token])

	const logindata = useSelector((state) => state.user);
	var islogged = logindata.islogged;   // logindata will consist true or false

	return (
		<>
			{islogged ? <Dashboard /> : <Login />}
		</>
	)
}
export async function getServerSideProps(ctx) {
	var { token } = parseCookies(ctx)
	if (token) {
		return { props: { token } }
	} else {
		return { props: {} }
	}
}
