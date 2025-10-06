import { UseFormReturn } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { CreatePostFormValues } from './create-post-form';
import { TagInputWithSuggestion } from './tag-input-with-suggestion';

interface InsertTagsFieldProps {
    form: UseFormReturn<CreatePostFormValues, unknown, CreatePostFormValues>;
}
const InsertTagsField = ({ form }: InsertTagsFieldProps) => {
    const handleTagRemove = (tag: string, tags: string[]) => {
        form.setValue(
            'tags',
            tags.filter((t) => t !== tag),
        );
    };

    return (
        <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap">
                        {field.value?.map((tag) => (
                            <div
                                key={tag}
                                className="bg-secondary/90 px-2 py-1 rounded-full text-sm mr-2 mb-2 flex items-center w-auto"
                            >
                                <span>{tag}</span>
                                <button
                                    className="ml-1 text-sm text-muted-foreground hover:text-red-500"
                                    type="button"
                                    onClick={() =>
                                        handleTagRemove(tag, field.value || [])
                                    }
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <FormControl>
                        <TagInputWithSuggestion field={field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default InsertTagsField;
