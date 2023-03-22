import React, { useState } from 'react';

function MyDay() {
  const [data, setData] = useState([
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 },
    { id: 3, name: 'Bob', age: 40 },
  ]);

  const handleEdit = (id: number, field: any, value: any) => {
    const newData = data.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      } else {
        return item;
      }
    });
    setData(newData);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td
              contentEditable
              onBlur={(e) => handleEdit(item.id, 'name', e.target.innerText)}
            >
              {item.name}
            </td>
            <td
              contentEditable
              onBlur={(e) => handleEdit(item.id, 'age', e.target.innerText)}
            >
              {item.age}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MyDay;
