import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import NumberFormat from 'react-number-format';
import { useUser } from '@auth0/nextjs-auth0';
import PubSub from 'pubsub-js'

export default function InventoryItem({ id, title, type, description, price }) {

    const { user } = useUser();

    function addToCart(id) {
      fetch("/api/cart", { 
        method: 'POST',
        body: id
      })
      .then((res) => res.json())
      .then(count => PubSub.publish('cart-count', count));
    }

    return (
      <Col key={id} md="3" className="mb-4 d-flex align-items-stretch">
        <Card className="w-100 border-info">
          <Card.Body className="d-flex flex-column">
            <h6>
              <Badge pill bg="info">
                <NumberFormat
                  value={price}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                  fixedDecimalScale={true}
                  decimalScale={2}
                ></NumberFormat>
              </Badge>
            </h6>
            <Card.Title>{title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{type}</Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
            <Card.Text>{description}</Card.Text>

            {user && (
              <div className="d-flex mt-auto">
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => addToCart(id)}
                >
                  Add to Cart
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    );
}