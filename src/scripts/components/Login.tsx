import React from 'react';
import User from '../models/User';

class Login extends React.Component<any, any>{
    constructor(props) {
        super(props);

        this.state = {
            error: false,
        }

        this.submit = this.submit.bind(this);
    }

    submit(e) {
        e.preventDefault();
        const userNameEl: any = this.refs.input1;
        const roomCodeEl: any = this.refs.input2;
        const userName = userNameEl.value.replace(/\n/g, "<br/>").replace(/\s\s+/g, ' ');
        const roomCode = roomCodeEl.value.replace(/\n/g, "<br/>").replace(/\s\s+/g, ' ');

        if (userName !== " " && userName !== "" && roomCode !== " " && roomCode !== "") {
            let user = new User(userName);

            this.props.onSubmit(user, roomCodeEl.value);
            userNameEl.value = "";
            roomCodeEl.value = "";
        }
        else this.setState({ error: true });
    }

    render() {
        return (
            <div className="login">
                <div className="login-title">JoyTalk</div>
                <div className="login-subtitle">Your quick chat solution against workplace IT.</div>
                <form className="login-form" onSubmit={(evt) => this.submit(evt)}>
                    <label htmlFor="">Enter your name:</label>
                    <input className="login-txt" type="text" placeholder="" ref="input1" maxLength={32} />
                    <div className="separator"></div>
                    <label className="room" htmlFor="">Enter room code:</label>
                    <input className="login-txt room" type="text" placeholder="" ref="input2" maxLength={32} />
                    <input className="submitLogin" type="submit" value="Enter" />
                    {this.state.error ? <span className="error">Please fill all fields.</span> : null}
                </form>
            </div>
        )
    }

    componentDidMount() {
        const input: any = this.refs.input1;
        input.focus();
    }
}


export default Login;