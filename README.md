# Retool org chart component
Org chart component for Retool built with `react-d3-tree`. This component automatically builds hierarchical organizational structures from flat employee data using `employee_id` <> `manager_id` relationships.

## Features

- Automatically constructs org charts from flat employee data
- Uses `manager_id` to build parent-child relationships
- Interactive nodes
- Responsive
- Zoom & Pan

## How to use
Generally, follow Retool docs on [custom components](https://docs.retool.com/apps/guides/custom/custom-component-libraries)

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/retool-orgchart-component.git
cd retool-orgchart-component

# Install deps
npm i

# Start development mode
npx retool-ccl dev

# Deploy to Retool
npx retool-ccl deploy
```

### Basic setup in Retool

1. Add the Org Chart component to your Retool app
2. Configure the `employeeData` property with your employee data
3. The component will automatically build the org chart hierarchy

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `employeeData` | String (JSON) | Sample employees | JSON string containing flat array of employees |
| `orientation` | String | "vertical" | Tree orientation: "vertical" or "horizontal" |
| `nodeColor` | String | "#495057" | Background color of internal nodes (default: dark grey) |
| `leafNodeColor` | String | "#ffffff" | Background color of leaf nodes (default: white) |
| `nodeBorderColor` | String | "#000000" | Border color of all nodes (default: black) |
| `linkColor` | String | "#999" | Color of the connecting lines |
| `backgroundColor` | String | "#ffffff" | Background color of the component |
| `width` | Number | 800 | Width of the chart area in pixels |
| `height` | Number | 600 | Height of the chart area in pixels |

### Employee data structure

The component expects a **JSON string** with an array of employee objects. Each employee must have these fields:

```json
[
  {
    "employee_id": "1",
    "first_name": "John",
    "last_name": "Smith",
    "is_manager": true,
    "start_date": "2020-01-15",
    "manager_id": null,
    "title": "Chief Executive Officer",
    "department": "Executive"
  },
  {
    "employee_id": "2",
    "first_name": "Sarah",
    "last_name": "Johnson",
    "is_manager": true,
    "start_date": "2020-03-01",
    "manager_id": "1",
    "title": "Chief Technology Officer",
    "department": "Technology"
  }
]
```

### Required fields

- **`employee_id`** (required): Unique identifier for the employee
- **`first_name`** (required): Employee's first name
- **`last_name`** (required): Employee's last name
- **`is_manager`** (required): Boolean indicating if employee is a manager
- **`start_date`** (required): Employee's start date (ISO date string)
- **`manager_id`** (optional): ID of the employee's manager (null for root/CEO)

### Optional fields

- **`title`**: Job title or role description
- **`department`**: Department or team name

### How it works

1. **Flat Data Input**: You provide a flat array of employees
2. **Automatic Hierarchy**: The component finds the root employee (no `manager_id`)
3. **Recursive Building**: It recursively builds the tree by matching `manager_id` with `employee_id`
4. **Visual Rendering**: Renders the hierarchical structure with interactive nodes

## Examples

### Basic employee list

```json
[
  {"employee_id": "1", "first_name": "Manager", "last_name": "Smith", "is_manager": true, "is_active": true, "start_date": "2020-01-01", "manager_id": null, "title": "Team Manager"},
  {"employee_id": "2", "first_name": "John", "last_name": "Doe", "is_manager": false, "is_active": true, "start_date": "2021-01-01", "manager_id": "1", "title": "Developer"},
  {"employee_id": "3", "first_name": "Jane", "last_name": "Wilson", "is_manager": false, "is_active": true, "start_date": "2021-02-01", "manager_id": "1", "title": "Designer"}
]
```

### Company structure

```json
[
  {"employee_id": "1", "first_name": "CEO", "last_name": "Johnson", "is_manager": true, "is_active": true, "start_date": "2019-01-01", "manager_id": null, "title": "Chief Executive Officer", "department": "Executive"},
  {"employee_id": "2", "first_name": "VP", "last_name": "Engineering", "is_manager": true, "is_active": true, "start_date": "2019-03-01", "manager_id": "1", "title": "Vice President of Engineering", "department": "Technology"},
  {"employee_id": "3", "first_name": "VP", "last_name": "Sales", "is_manager": true, "is_active": true, "start_date": "2019-02-01", "manager_id": "1", "title": "Vice President of Sales", "department": "Sales"},
  {"employee_id": "4", "first_name": "Engineering", "last_name": "Manager", "is_manager": true, "is_active": true, "start_date": "2020-01-01", "manager_id": "2", "title": "Engineering Manager", "department": "Engineering"},
  {"employee_id": "5", "first_name": "DevOps", "last_name": "Lead", "is_manager": true, "is_active": true, "start_date": "2020-03-01", "manager_id": "2", "title": "DevOps Team Lead", "department": "Engineering"}
]
```

## Customization

### Information displayed
- Employee full name
- Job title (if provided)

### Colors
- `nodeColor`: internal node background color (dark grey by default)
- `leafNodeColor`: leaf node background color (white by default)
- `nodeBorderColor`: border color for all nodes (black by default)
- `linkColor`: connecting line color
- `backgroundColor`: component background

### Layout
- `orientation`: vertical or horizontal
- `width` and `height`: chart dimensions

## Dependencies
- `react-d3-tree`: tree visualization library
- `@tryretool/custom-component-support`: Retool integration
- `react`
- `@types/d3`: TypeScript definitions for D3