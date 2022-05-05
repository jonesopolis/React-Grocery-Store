import Table from 'react-bootstrap/Table';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'next/image';

export const getServerSideProps = withPageAuthRequired();

export default function Profile({ user }) {

  return (
    <>
      <h1 className="display-1">Hello, {user.nickname}!</h1>

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
              <tr>
                <td>Email</td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{user.name}</td>
              </tr>
              <tr>
                <td>Nickname</td>
                <td>{user.nickname}</td>
              </tr>
              <tr>
                <td>Picture</td>
                <td><Image src={user.picture} height='50px' width='50px'></Image></td>
              </tr>
              <tr>
                <td>Sub</td>
                <td>{user.sub}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
}
