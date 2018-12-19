//Class for a users account

class Profile {
    constructor() {
        this.state = {
            authenticated : JSON.parse(sessionStorage.getItem('authenticated')) || null,
            uid: sessionStorage.getItem('uid') || null,
            email: sessionStorage.getItem('email') || null,
            firstname: sessionStorage.getItem('firstname') || null,
            lastname: sessionStorage.getItem('lastname') || null,
            password: sessionStorage.getItem('password') || null,
        };

        this.signIn = this.signIn.bind(this);
        this.getName = this.getName.bind(this);
    }
  
    getName() {
      return this.state.firstname+' '+this.state.lastname;
    }
  
    getUID() {
      return this.uid;
    }

    loggedIn(){
        return this.state.authenticated;
    }
  
    async signIn(email, password){
        const response = await fetch('/api/getuser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email : email, password : password})
          });

          const result = JSON.parse(await response.text());

            if(result.error == null){
                this.state.authenticated = true;
                this.state.uid = result.uid;
                this.state.email = result.email;
                this.state.firstname = result.fname;
                this.state.lastname = result.lname;
                this.state.password = result.password;
                
                sessionStorage.setItem('authenticated', JSON.stringify(this.state.authenticated));
                sessionStorage.setItem('uid', JSON.stringify(this.state.uid));
                sessionStorage.setItem('email', JSON.stringify(this.state.email));
                sessionStorage.setItem('firstname', JSON.stringify(this.state.firstname));
                sessionStorage.setItem('lastname', JSON.stringify(this.state.lastname));
                sessionStorage.setItem('password', JSON.stringify(this.state.password));
            }

          console.log(this.state);
    }
  
  
    signOut() {
        console.log('Sign out!');
        this.state.authenticated = false;
        this.state.uid = null;
        this.state.email = null;
        this.state.firstname = null;
        this.state.lastname = null;
        this.state.password = null;
        
        sessionStorage.removeItem('authenticated');
        sessionStorage.removeItem('uid');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('firstname');
        sessionStorage.removeItem('lastname');
        sessionStorage.removeItem('password'); 
        
    }
  }

  const profile = new Profile();
    
  export default profile;