import React, { useState } from "react";
import { FaCode } from "react-icons/fa";
import { getBezierPath } from "reactflow";
import styles from "./Condition.module.css";
import Modal from "react-modal";
import InputConditions from "components/InputConditions";
import SubmitButton from "components/Buttons/SubmitButton";
import useStore from "lib/store";

const foreignObjectSize = 40;

export default function Condition({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: any) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const setEdgeParams = useStore((state) => state.setEdgeParams);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEdge, setCurrentEdge] = useState(null);
  const [inputs, setInputs] = useState([]);

  const openModal = (edgeId: any) => {
    setCurrentEdge(edgeId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onEdgeClick = (evt: any, id: any) => {
    evt.stopPropagation();
    openModal(id);
  };

  const handleInputsChange = (newInputs: any) => {
    console.log("newInputs", newInputs);
    setInputs(newInputs);
  };

  const handleInputsSave = (newInputs: any) => {
    console.log(inputs);
    setEdgeParams(id, inputs);
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className={styles.edgeDiv}>
          <button
            className={styles.edgeButton}
            onClick={(event) => onEdgeClick(event, id)}
          >
            <FaCode />
          </button>
        </div>
      </foreignObject>
      <Modal
        className={styles.modal}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
      >
        <div className={styles.modalHeader}>
          Set your conditions
          <InputConditions id={id} onInputsChange={handleInputsChange} />
        </div>
        <SubmitButton
          full={true}
          text="Save Condition"
          onClick={handleInputsSave}
        />
      </Modal>
    </>
  );
}
