import { React } from 'react';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { CONTACT_ABI, CONTACT_ADDRESS } from './config';

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
		alert('1 - submitting: ' + contactName);
		submitContact();
	        event.preventDefault();
       }

	


  return (
    <div>
    	Your account is: {account}
    	<h1>Contacts</h1>
    	<ul>
    	{
    		Object.keys(contacts).map((contact, index) => (
					<li key={`${contacts[index].name}-${index}`}>
						<h4>{contacts[index].name}</h4>
						<span><b>Phone: </b>{contacts[index].phone}</span>
					</li>
				))
    	}
    	</ul>



      <form onSubmit={handleSubmit}>
        <label>
          Essay:
          <textarea name='name' onChange={updateName}/>
          <textarea name='phone' onChange={updatePhone}/>
        </label>
        <input type="submit" value="Submit" />
      </form>
</div>

  );
}

export default App;
