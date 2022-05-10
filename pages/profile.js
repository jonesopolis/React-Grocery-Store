import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useEffect } from 'react';
import {
  useMsal,
  useAccount,
  useIsAuthenticated
} from "@azure/msal-react";


export default function Profile() { 
  
  const { accounts, instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  let account = useAccount(accounts[0]);;

    useEffect(() => {      
      if(!isAuthenticated) {
        instance.handleRedirectPromise().then(async () => await instance.loginRedirect());
      }
    }, [isAuthenticated])

  return (
    <>
      {isAuthenticated && (
        <>
          <h1 className="display-1">
            {`Welcome, ${account?.idTokenClaims?.family_name}!`}
          </h1>

          <Row>
            <Col md="6">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {account &&
                    account.idTokenClaims &&
                    Object.keys(account.idTokenClaims).map((key) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{account.idTokenClaims[key]}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
