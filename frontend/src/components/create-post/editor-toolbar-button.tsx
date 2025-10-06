import { Button } from '../ui/button';

const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
}> = ({ onClick, isActive, disabled, children, title }) => (
    <Button
        onClick={onClick}
        disabled={disabled}
        variant={isActive ? 'secondary' : 'ghost'}
        size="sm"
        type="button"
        className={`w-10 h-10 p-0 ${isActive ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        title={title}
    >
        {children}
    </Button>
);
export default ToolbarButton;
