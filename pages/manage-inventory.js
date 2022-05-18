import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import NumberFormat from "react-number-format";
import {  useState } from "react";
import { useGroceryServices } from "../components/grocery-service-context";

export default function ManageInventory() {

    const { inventoryService } = useGroceryServices();
    const [inventoryItem, setInventoryItem] = useState({ title: "", type: "", description: "", price: 0.0 });

    const [showAddedSuccessfully, setShowAddedSuccessfully] = useState(false);
    const [resettingInventory, setResettingInventory] = useState(false);
    const [showResetInventorySuccessfully, setShowResetInventorySuccessfully] = useState(false);

    async function submit() {
        await inventoryService.addInventory(inventoryItem);
        setShowAddedSuccessfully(true);
        setTimeout(() => setShowAddedSuccessfully(false), 2000)
        setInventoryItem({ title: "", type: "", description: "", price: 0.0 });
    }

    async function resetInventory() {
      setResettingInventory(true);
      await inventoryService.resetInventory();
      setResettingInventory(false);
      setShowResetInventorySuccessfully(true);
      setTimeout(() => setShowResetInventorySuccessfully(false), 2000)
    }

    return (
      <Row>
        <Col md="4">
          <h1 className="display-6">Add new inventory item</h1>
          <hr />

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={inventoryItem.title}
                onChange={(e) =>
                  setInventoryItem({ ...inventoryItem, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                value={inventoryItem.type}
                onChange={(e) =>
                  setInventoryItem({ ...inventoryItem, type: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={inventoryItem.description}
                onChange={(e) =>
                  setInventoryItem({
                    ...inventoryItem,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <NumberFormat
                className="form-control"
                value={inventoryItem.price}
                onValueChange={(e) =>
                  setInventoryItem({ ...inventoryItem, price: e.value })
                }
                thousandSeparator={true}
                prefix={"$"}
                fixedDecimalScale={true}
                decimalScale={2}
              ></NumberFormat>
            </Form.Group>

            <Button variant="primary" onClick={submit}>
              Add
            </Button>
            {showAddedSuccessfully && (
              <span className="mx-3 text-success">Added to Inventory!</span>
            )}
          </Form>
        </Col>

        <Col
          md="4"
          className="d-flex align-items-center justify-content-center"
        >
          <h1 className="display-4"> - OR - </h1>
        </Col>

        <Col
          md="4"
          className="d-flex align-items-center justify-content-center"
        >
          <Button onClick={resetInventory} variant="info" size="lg">
            {resettingInventory && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                className="mx-2"
              />
            )}
            Reset Inventory
          </Button>
          {showResetInventorySuccessfully && (
            <span className="mx-3 text-success">Inventory Reset!</span>
          )}
        </Col>
      </Row>
    );
}