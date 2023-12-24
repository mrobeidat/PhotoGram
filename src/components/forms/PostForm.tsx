import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Models } from "appwrite";
import { PostValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import { Textarea } from "../ui/textarea"
import FileUploader from "../Shared/FileUploader"
import Loader from "../Shared/Loader"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type PostFormProps = {
    post?: Models.Document;
    action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useUserContext();
    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post ? post?.caption : "",
            file: [],
            location: post ? post.location : "",
            tags: post ? post.tags.join(",") : "",
        },
    });


    // Query
    const { mutateAsync: createPost, isPending: isLoadingCreate } =
        useCreatePost();
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
        useUpdatePost();

    const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
        try {
            // ACTION = UPDATE
            if (post && action === "Update") {
                const updatedPost = await updatePost({
                    ...value,
                    postId: post.$id,
                    imageId: post.imageId,
                    imageUrl: post.imageUrl,
                });

                if (updatedPost) {
                    toast({
                        title: "Post updated successfully!",
                        style: { background: "rgb(3, 73, 26)" }
                    });
                    navigate(`/posts/${post.$id}`);
                } else {
                    toast({
                        title: "Update post failed. Please try again.",
                        style: { background: 'linear-gradient(to top, #a90329 0%, #8f0222 44%, #6d0019 100%)' },
                    });
                }
                return;
            }

            // ACTION = CREATE
            const newPost = await createPost({
                ...value,
                userId: user.id,
            });
            // check if the image field is not empty
            if (!value.file.length) {
                toast({
                    title: "Please select an image file",
                    style: {
                        background: 'linear-gradient(to top, #a90329 0%, #8f0222 44%, #6d0019 100%)',
                    },
                });
                return;
            }
            if (newPost) {
                toast({
                    title: "Post created successfully!",
                    style: { background: "rgb(3, 73, 26)" }
                });
                navigate("/");
            }
            else {
                toast({
                    title: "Create post failed. Please try again.",
                    style: { background: 'linear-gradient(to top, #a90329 0%, #8f0222 44%, #6d0019 100%)' },

                });
            }
        } catch (error) {
            console.error("Error handling form submission:", error);
            toast({
                title: "An unexpected error occurred. Please try again.",
            });
        }
    };

    const COLORS = [
        "#000000", "#e60000", "#ff9900", "#ffff00", "#008A00", "#0066cc", "#9933ff",
        "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff",
        "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff",
        "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2",
        "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466",
        "#1F75FE", "#00BFFF"
    ];

    const toolbarOptions = [['bold', 'italic', 'underline'], ['link'],
    [{ 'color': COLORS }, { 'background': COLORS }], [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ];

    // To check if there are any changes on the form so the update button will be enabled otherwise it will be disabled using "isDirty" property.
    const { formState } = form;
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-9 w-full  max-w-5xl">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Caption <span className="text-red text-lg">*</span></FormLabel>
                            <FormControl>
                                <ReactQuill
                                    className="shad-textarea"
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    placeholder="Write your caption here..."
                                    theme="snow"
                                    modules={{
                                        toolbar: toolbarOptions
                                    }}
                                />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add Photos <span className="text-red text-lg">*</span></FormLabel>
                            <FormControl>
                                <FileUploader
                                    fieldChange={field.onChange}
                                    mediaUrl={post?.imageUrl}
                                />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add Location <span className="text-red text-lg">*</span></FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">
                                Add Tags (separated by comma " , ") <span className="text-red text-lg">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Art, Expression, Learn"
                                    type="text"
                                    className="shad-input"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4 items-center justify-end">
                    <Button
                        type="button"
                        className="shad-button_dark_4"
                        onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="shad-button_primary whitespace-nowrap"
                        disabled={isLoadingCreate || isLoadingUpdate || !formState.isDirty}>
                        {(isLoadingCreate || isLoadingUpdate) && <Loader />}
                        {action} Post
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm