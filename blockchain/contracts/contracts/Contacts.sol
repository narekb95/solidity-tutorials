pragma solidity >=0.4.22 <0.9.0;

contract Contacts {
  uint public count = 0; // state variable

  struct Contact {
		uint id;
		string name;
		string phone;
	}

	constructor() public {
		createContact('Narek Bojikian', '123123123');
		createContact('Haik Bojikian', '333555888');
	}

	mapping(uint => Contact) public contacts;

	function createContact(string memory _name, string memory _phone) public {
		count++;
		contacts[count] = Contact(count, _name, _phone);
	}
}
