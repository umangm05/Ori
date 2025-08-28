import React, { useEffect, useState } from 'react';
import { FrontendApi, Configuration } from "@ory/client"

function Login() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString)
  const flowId = params.get("flow");
  console.log("🚀 ~ Login ~ flowId:", flowId)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [flow, setFlow] = useState(null); 
  
  const basePath = "http://localhost:4000"
    const ory = new FrontendApi(
        new Configuration({
            basePath,
            baseOptions: {
                withCredentials: true,
            },
        }),
    )

    useEffect(() => {
      const fetchFlow = async () => {
        try {
          const { data } = await ory.getRegistrationFlow({ id: flowId });
          console.log("🚀 ~ fetchFlow ~ data:", data)
          setFlow(data);
        } catch (err) {
          console.error("Error fetching login flow:", err.response?.data || err.message);
        }
      };
      if (flowId) {
        fetchFlow();
      }
    }, [flowId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 ~ handleSubmit ~ flow:", flow)

    const formData = new URLSearchParams();
    formData.append('csrf_token', flow.ui.nodes.find(node => node.attributes.name === 'csrf_token').attributes.value);
    formData.append('traits.email', "test6@email.com");
    formData.append('traits.role', "customer");
    formData.append('method', "password");
    formData.append('password', "Ab$c@124#");

    const data = await fetch(`http://localhost:4000/self-service/registration?flow=${flowId}`, {
      method: "post",
      body: formData.toString(),
      // body: JSON.stringify({
      //   csrf_token: flow.ui.nodes.find(node => node.attributes.name === 'csrf_token').attributes.value,
      //   // csrf_token: "DF5Ptt95g0Njp6ZdRNJmKQ1H9EdXPcHOG6VrNOt0Hwk=",
      //   method: "password",
      //   traits: {
      //     email: "test3@email.com",
      //     role: "customer",
      //   },
      //   password: "Abc@#121*"
      // }),
      headers: {
        // 'X-CSRF-Token': flow.ui.nodes.find(node => node.attributes.name === 'csrf_token').attributes.value,
        // 'X-CSRF-Token': csrf_token,
        "content-type": "application/x-www-form-urlencoded"
      },
      credentials: 'include'
    })
    console.log("🚀 ~ handleSubmit ~ data:", data)
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;