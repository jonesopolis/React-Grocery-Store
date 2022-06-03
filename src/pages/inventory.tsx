import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InventoryItemView from '../components/inventory-item-view';
import { useState, useEffect } from 'react';
import { useGroceryServices } from '../components/grocery-service-context';
import Spinner from 'react-bootstrap/Spinner';
import InventoryItem from '../models/inventory-item';

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterType] = useState("");

  let { inventoryService } = useGroceryServices();

  useEffect(() => {
    let filtering = inventory;
    
    if(filterText) {
      filtering = filtering.filter(x => x.title.toLowerCase().includes(filterText));
    }

    if(filterType) {
      filtering = filtering.filter(x => x.type === filterType);
    }

    setFilteredInventory(filtering);
  }, [filterType, filterText]);

  useEffect(() => {
    const doWork = async () => {
      let data = await inventoryService.getInventory();
      setInventory(data);
      setFilteredInventory(data);
    }

    doWork();
  }, []);

  function clearFilters() {
    setFilterText("");
    setFilterType("");
  }

  return (
    <>
      <Form className="form-inline row justify-content-center">
        <Form.Group className="col-3">
          <Form.Label>Filter</Form.Label>
          <Form.Control
            type="text"
            placeholder="..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value.trim().toLowerCase())}
          />
        </Form.Group>
        <Form.Group className="mb-3 col-3">
          <Form.Label>Type</Form.Label>
          <Form.Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value=""></option>
            {[...new Set(inventory.map(({ type }) => type))].sort().map((x) => (
              <option value={x} key={x}>
                {x}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="col-2">
          <Form.Label>&nbsp;</Form.Label>
          <div>
            <Button variant="outline-warning" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </Form.Group>
      </Form>

      <div className="gradient mt-1 mb-4"></div>

      {!inventory.length && (
        <div className="d-flex justify-content-center">
          <Spinner animation="grow" variant="info" />
        </div>
      )}
      
      <Row>
        {filteredInventory.map(({ id, title, type, description, price }) => (
          <InventoryItemView
            id={id}
            title={title}
            type={type}
            description={description}
            price={price}
            key={id}
          ></InventoryItemView>
        ))}
      </Row>
    </>
  );
}

export default Inventory;