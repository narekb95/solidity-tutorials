import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import { React } from 'react';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { CONTACT_ABI, CONTACT_ADDRESS } from './config';
import CardHeader from 'react-bootstrap/esm/CardHeader';

function App() {
	const [account, setAccount] = useState();
	const [contactList, setContactList] = useState();
	const [contacts, setContacts] = useState([]);


	useEffect(() => { async function load() {

		const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
	    const accounts = await web3.eth.requestAccounts();
	    const account = accounts[0];
	    setAccount(account);

	    const contactList = new web3.eth.Contract(CONTACT_ABI, CONTACT_ADDRESS);
	    setContactList(contactList);

	    const counter = await contactList.methods.count().call();

	    for (var i = 1; i <= counter; i++) {
	      const contact = await contactList.methods.contacts(i).call();
	      setContacts((contacts) => [...contacts, contact]);
	    }
		}

		load();
	}, []);

	function handleAccountChanged(accounts){
		window.location.reload(false);
	}
	window.ethereum.on('accountsChanged', handleAccountChanged)

	var contactName = '';
	var contactPhone = '';
	const updateName = (event) => {
		contactName = event.target.value;
	}
	const updatePhone = (event) => {
		contactPhone = event.target.value;
	}
	const submitContact = async() => {
	const out = await contactList.methods.createContact(
		contactName, contactPhone).send({from:account});
		window.location.reload(false);
	}
	const handleSubmit = async (event) => {
	alert('Submitting: ' + contactName);
	submitContact();
		event.preventDefault();
	}

	var stringAccount = String(account);
	var shortenString = (str)=>{return str.substring(0, 10) + ' ... ' + str.substring(str.length - 5)}
	return (
    <div className="m-2">
	<Badge pill className="bg-warning text-white p-3 m-2">Account: {shortenString(stringAccount)}</Badge>
    	<h1 className="contactsheader">Contacts</h1>
		<ListGroup className="m-5">{
    		Object.keys(contacts).filter(contract =>
					contacts[contract].sender === account)
					.map((contact, index) => (
					<ListGroup.Item className="w-25 border-0" key={`${contacts[contact].name}-${index}`}>
						<Card><CardHeader>{contacts[contact].name}</CardHeader>
						<Card.Text className="p-3 text-center"><span className='contactPhoneLi'>{contacts[contact].phone}</span></Card.Text></Card></ListGroup.Item>))
    	}</ListGroup>

      <Form className="p-3" onSubmit={handleSubmit}>
		<Form.Label><h3>Add contact</h3></Form.Label>
		<Form.Control className='mb-3 input' type="name" name='name' onChange={updateName} placeholder="Enter name" />
		<Form.Control className='mb-3 input' type="name" name='phone' onChange={updatePhone} placeholder="Enter phone" />
        <Button variant="primary" className="submitButton" as="input" type="submit" value="Submit" />{' '}
      </Form>
</div>

  );
}

export default App;
