import React from 'react';
import ReactDOM from 'react-dom';

import Message from './Message';

class Chatroom extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            chats: [
                {
                    username: "Kevin Hsu",
                    content: <p>Hello World!</p>,
                    img: "http://i.imgur.com/Tj5DGiO.jpg",
                },
                {
                    username: "Alice Chen",
                    content: <p>Foo</p>,
                    img: "http://i.imgur.com/Tj5DGiO.jpg",
                },
            ]
        };

        this.submitMessage = this.submitMessage.bind(this);
    }

    componentDidMount() {
        this.scrollToBot();
    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    scrollToBot() {
        //ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
    }

    submitMessage(e) {
        e.preventDefault();

        // this.setState({
        //     chats: this.state.chats.concat([{
        //         username: "Kevin Hsu",
        //         content: <p>{ReactDOM.findDOMNode(this.refs.msg).value}</p>,
        //         img: "http://i.imgur.com/Tj5DGiO.jpg",
        //     }])
        // }, () => {
        //     ReactDOM.findDOMNode(this.refs.msg).value = "";
        // });
    }

    render() {
        const username = "Kevin Hsu";
        const { chats }: any = this.state;

        return (
            <div className="chatroom">
                <h3>JoyTalk</h3>
                <ul className="chats" ref="chats">
                    {
                        chats.map((chat) =>
                            <Message chat={chat} user={username} />
                        )
                    }
                </ul>
                <form className="input" onSubmit={(e) => this.submitMessage(e)}>
                    <input type="text" ref="msg" />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default Chatroom;