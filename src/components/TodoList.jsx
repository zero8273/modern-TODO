import { TodoItem } from './TodoItem';
import { DndContext, closestCenter } from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
const TodoList = ({
  todos,
  toggleCompleted,
  handleUpdate,
  setDelitingID,
  onReorder,
}) => {
  const todoIds = todos.map((todo) => todo.id);
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id !== over.id) {
      onReorder(active.id, over?.id);
    }
  };
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext strategy={verticalListSortingStrategy} items={todoIds}>
        <div className="flex flex-col gap-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={() => {
                setDelitingID(todo.id);
              }}
              onToggleCompleted={toggleCompleted}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default TodoList;
