import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InventoryItem from '../components/inventory-item';
import { useState, useEffect } from 'react';
import { getInventory } from '../src/inventory-repo';

export async function getStaticProps() {
  
  const data = getInventory();

  return {
    props: { inventory: data }, 
  }
}

export default function Inventory({ inventory }) {
  const [filteredInventory, setFilteredInventory] = useState(inventory);
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterType] = useState("");

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

      <div className='gradient mt-1 mb-4'></div>

      <Row>
        {filteredInventory.map(({ id, title, type, description, price }) => (
          <InventoryItem
            id={id}
            title={title}
            type={type}
            description={description}
            price={price}
            key={id}
          ></InventoryItem>
        ))}
      </Row>
    </>
  );
}
