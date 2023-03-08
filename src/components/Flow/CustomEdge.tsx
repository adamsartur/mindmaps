import { getBezierPath } from "reactflow";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: any) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path wat"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <text>
        <textPath
          style={{ fontSize: 12 }}
          startOffset="50%"
          textAnchor="middle"
        >
          {data.label}
        </textPath>
      </text>
    </>
  );
}
