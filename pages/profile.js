import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'next/image';
import {
  useMsal,
  useAccount,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { useEffect } from 'react';

export default function Profile() { 
  
  const { accounts } = useMsal();
  let account = useAccount(accounts[0] || {});
 
  return (
    <AuthenticatedTemplate>
      <h1 className="display-1">
        Hello, {account?.idTokenClaims?.family_name}!
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
              {account && account.idTokenClaims && Object.keys(account.idTokenClaims).map(
                (key) => (
                  <tr>
                    <td>{key}</td>
                    <td>{account.idTokenClaims[key]}</td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </AuthenticatedTemplate>
  );
}
