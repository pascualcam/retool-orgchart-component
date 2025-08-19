import React, { useMemo } from 'react'
import { type FC } from 'react'
import { Tree } from 'react-d3-tree'
import { Retool } from '@tryretool/custom-component-support'

interface Employee {
  employee_id: string
  first_name: string
  last_name: string
  is_manager: boolean
  start_date: string
  manager_id?: string | null
  title?: string
  department?: string
}

interface TreeNode {
  name: string
  fullName: string
  title?: string
  department?: string
  isManager: boolean
  startDate: string
  employeeId: string
  children?: TreeNode[]
}

export const OrgChart: FC = () => {
  // Retool state management for configurable properties
  const [employeeData, setEmployeeData] = Retool.useStateString({
    name: 'employeeData',
    initialValue: '[]'
  })

  const [orientation, setOrientation] = Retool.useStateString({
    name: 'orientation',
    initialValue: 'vertical'
  })

  const [nodeColor, setNodeColor] = Retool.useStateString({
    name: 'nodeColor',
    initialValue: '#6c757d'
  })



  const [linkColor, setLinkColor] = Retool.useStateString({
    name: 'linkColor',
    initialValue: '#999'
  })

  const [backgroundColor, setBackgroundColor] = Retool.useStateString({
    name: 'backgroundColor',
    initialValue: '#ffffff'
  })

  const [width, setWidth] = Retool.useStateNumber({
    name: 'width',
    initialValue: 800
  })

  const [height, setHeight] = Retool.useStateNumber({
    name: 'height',
    initialValue: 600
  })

  let employees: Employee[] = []
  try {
    if (typeof employeeData === 'string') {
      employees = JSON.parse(employeeData)
    } else if (Array.isArray(employeeData)) {
      employees = employeeData
    } else {
      employees = []
    }
  } catch (error) {
    employees = []
  }

  // hierarchical tree structure
  const treeData = useMemo(() => {
    if (!employees.length) return null

    const employeeMap = new Map<string, Employee>()
    employees.forEach(emp => employeeMap.set(emp.employee_id, emp))

    // root employee (no manager_id)
    const rootEmployee = employees.find(emp => !emp.manager_id)
    if (!rootEmployee) {
      console.log('No root employee found (no employee with manager_id: null)')
      return null
    }

    console.log('Root employee found:', rootEmployee)

    // recursively build the tree
    const buildTree = (employee: Employee): TreeNode => {
      const children = employees
        .filter(emp => emp.manager_id === employee.employee_id)
        .map(buildTree)

      console.log(`Building tree for ${employee.first_name} ${employee.last_name}, children:`, children.length)

      return {
        name: `${employee.first_name} ${employee.last_name}`,
        fullName: `${employee.first_name} ${employee.last_name}`,
        title: employee.title,
        department: employee.department,
        isManager: employee.is_manager,
        startDate: employee.start_date,
        employeeId: employee.employee_id,
        children: children.length > 0 ? children : undefined
      }
    }

    const result = buildTree(rootEmployee)
    console.log('Final tree structure:', result)
    return result
  }, [employees])

  const nodeSize = { x: 300, y: 120 }
  const separation = { siblings: 2, nonSiblings: 2.5 }

  const renderCustomNode = ({ nodeDatum, toggleNode }: any) => {
    const nodeFillColor = nodeColor

    return (
      <g>
        <circle
          r={20}
          fill={nodeFillColor}
          stroke={nodeFillColor}
          strokeWidth={1}
          onClick={toggleNode}
          style={{ cursor: 'pointer' }}
        />
        <text
          x={30}
          y={0}
          textAnchor="start"
          fontSize="12"
          fontWeight="bold"
          fill="#000000"
          dominantBaseline="middle"
          style={{ 
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            textRendering: 'optimizeLegibility',
            fontSmooth: 'antialiased',
            paintOrder: 'stroke fill',
            stroke: 'none'
          }}
          data-node-id={nodeDatum.employeeId}
          data-node-name={nodeDatum.name}
        >
          {nodeDatum.name}
        </text>
        {nodeDatum.title && (
          <text
            x={30}
            y={15}
            textAnchor="start"
            fontSize="10"
            fill="#000000"
            dominantBaseline="middle"
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              textRendering: 'optimizeLegibility',
              fontSmooth: 'antialiased',
              paintOrder: 'stroke fill',
              stroke: 'none'
            }}
          >
            {nodeDatum.title}
          </text>
        )}
      </g>
    )
  }

  if (!treeData) {
    return (
      <div style={{ 
        backgroundColor, 
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        textAlign: 'center'
      }}>
        <h3>Debug Information</h3>
        <p><strong>Total Employees:</strong> {employees.length}</p>
        <p><strong>Employee IDs:</strong> {employees.map(emp => emp.employee_id).join(', ')}</p>
        <p><strong>Manager IDs:</strong> {employees.map(emp => emp.manager_id).join(', ')}</p>
        <p><strong>Root Employee:</strong> {employees.find(emp => !emp.manager_id)?.first_name || 'None found'}</p>
        <hr />
        <p><strong>Issue:</strong> Could not build tree structure. Check that:</p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>You have at least one employee with <code>manager_id: null</code></li>
          <li>All <code>manager_id</code> values match existing <code>employee_id</code> values</li>
          <li>Data structure matches the expected format</li>
        </ul>
        <hr />
        <p><strong>Raw Data Preview:</strong></p>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '12px',
          maxHeight: '200px',
          overflow: 'auto',
          textAlign: 'left'
        }}>
          {JSON.stringify(employees.slice(0, 3), null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <div style={{ 
      backgroundColor, 
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <style>
        {`
          .link {
            stroke: ${linkColor};
            stroke-width: 2;
            fill: none;
          }
          .link:hover {
            stroke-width: 3;
            stroke: ${nodeColor};
          }
          
          /* Force consistent node styling */
          .rd3t-node {
            fill: ${nodeColor} !important;
            stroke: ${nodeColor} !important;
          }
          
          .rd3t-leaf-node {
            fill: ${nodeColor} !important;
            stroke: ${nodeColor} !important;
          }
          
          /* Force consistent text styling */
          .rd3t-node text {
            fill: #000000 !important;
            text-rendering: optimizeLegibility !important;
            font-smooth: antialiased !important;
            dominant-baseline: middle !important;
            paint-order: stroke fill !important;
            stroke: none !important;
          }
          
          .rd3t-leaf-node text {
            fill: #000000 !important;
            text-rendering: optimizeLegibility !important;
            font-smooth: antialiased !important;
            dominant-baseline: middle !important;
            paint-order: stroke fill !important;
            stroke: none !important;
          }
        `}
      </style>
      
      <div style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        margin: '0 auto',
        border: '2px dashed #ccc',
        position: 'relative'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          background: '#fff', 
          padding: '5px',
          fontSize: '10px',
          zIndex: 1000
        }}>
          Tree Container: {width}x{height}px
        </div>
        
        {treeData ? (
          <Tree
            data={treeData}
            orientation={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
            nodeSize={nodeSize}
            separation={separation}
            renderCustomNodeElement={renderCustomNode}
            pathClassFunc={() => 'link'}
            translate={{ x: width / 3, y: height / 3 }}
            zoom={1.2}
            scaleExtent={{ min: 0.3, max: 3 }}
            enableLegacyTransitions={false}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            color: '#666'
          }}>
            No tree data available
          </div>
        )}
      </div>
      

    </div>
  )
}
