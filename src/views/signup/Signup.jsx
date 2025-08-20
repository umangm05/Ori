import React, { useEffect, useState } from 'react';
import { FrontendApi, Configuration } from "@ory/client"

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [flow, setFlow] = useState(null); 

  const ory = new FrontendApi(
    new Configuration({
      basePath: "http://localhost:4000",  // Ory project URL from Ory Console
      baseOptions: {
        withCredentials: true,
      },
    })
  );
  
 

  useEffect(() => {
    const initializeFlow = async () => {
      try {
        const { data } = await ory.createBrowserLoginFlow();
        console.log("🚀 ~ initializeFlow ~ data:", data)
        setFlow(data);
      } catch (err) {
        console.error("Error creating login flow:", err.response?.data || err.message);
      }
    };
    initializeFlow();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 ~ handleSubmit ~ flow:", flow)

    // 2. Update the registration flow with user details and set role as "customer"
    const { data } = await ory.updateRegistrationFlow({
      flow: flow.id,
      updateRegistrationFlowBody: {
        method: "password",  // The method you're using for registration
        password: password,  // Password input
        csrf_token: flow.ui.nodes.find(node => node.attributes.name === 'csrf_token').attributes.value,  // Get CSRF token
        traits: {
          email: email,       // Email input from form
          role: "customer"    // Automatically set the role to "customer"
        }
      }
    });
    console.log("🚀 ~ handleSubmit ~ data:", data)

  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;