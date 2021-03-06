import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import NumberFormat from 'react-number-format';
import PubSub from 'pubsub-js'
import { useGroceryServices } from './grocery-service-context';
import InventoryItem from '../models/inventory-item';
import { useSession } from "next-auth/react";

const InventoryItemPage = ({ id, title, type, description, price }: InventoryItem) => {

  const { cartService } = useGroceryServices();
  const { data: session } = useSession();

  async function addToCart(id: number) {
    var totalCount = await cartService.addToCart(id);
    PubSub.publish('cart-count', totalCount);

    if(window.appInsights) {
      window.appInsights.trackEvent({name: "User Added Item to Cart"});
    }
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

          {session && (
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

export default InventoryItemPage;