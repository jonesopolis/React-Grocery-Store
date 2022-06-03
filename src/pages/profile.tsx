import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useSession } from "next-auth/react";

const Profile = () => { 
  const { data: session } = useSession({ required: true });

  return (
    <>
      {session && (
        <>
          <h1 className="display-1">
            {`Welcome, ${session?.user?.family_name}!`}
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
                  {session &&
                    session.user &&
                    Object.entries(session.user).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
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

export default Profile;