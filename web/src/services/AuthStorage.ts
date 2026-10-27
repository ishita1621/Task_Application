export type DemoUser={
    id:number;
    email:string;
    password:string;
};

const USER_KEY="demoUser";

export function createDemoUser():void{
    const existingUser=localStorage.getItem(USER_KEY);

    if(existingUser){
        return;
    }

    const demoUser:DemoUser={
        id:1,
        email:"abc@gmail.com",
        password:"abcABC12"
    };
    localStorage.setItem(USER_KEY,JSON.stringify(demoUser));
}

export function authenticateUser(
    email:string,
    password:string
):boolean{
    const storedUser=localStorage.getItem(USER_KEY);

    if(!storedUser){
        return false;
    }

    try{
        const user: DemoUser=JSON.parse(storedUser);
        return (
            user.email.toLowerCase()=== email.trim().toLowerCase() &&
            user.password===password
        );
    }catch{
        return false;
    }
}