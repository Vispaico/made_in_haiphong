// src/components/admin/ArticleForm.tsx
import { Button } from '@/components/ui/Button';
import 'react-quill/dist/quill.snow.css';
import slugify from 'slugify';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type ArticleFormData = {
  title: string;
  slug: string;
  featuredImage: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  published: boolean;
};

interface ArticleFormProps {
  article?: Article;
}

export default function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter();
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<ArticleFormData>({
    defaultValues: {
      title: article?.title || '',
      slug: article?.slug || '',
      featuredImage: article?.featuredImage || '',
      content: article?.content || '',
      metaTitle: article?.metaTitle || '',
      metaDescription: article?.metaDescription || '',
      published: article?.published || false,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = watch('title');

  useEffect(() => {
    if (title) {
      setValue('slug', slugify(title, { lower: true, strict: true }));
    }
  }, [title, setValue]);

  const quillRef = useRef<any>(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input.files) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const { url } = await response.json();
          if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', url);
          }
        } else {
          alert('Failed to upload image.');
        }
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

  const onSubmit = async (data: ArticleFormData) => {
    setIsSubmitting(true);
    const url = article ? `/api/admin/articles/${article.id}` : '/api/admin/articles';
    const method = article ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push('/admin/articles');
      router.refresh();
    } else {
      alert(`Failed to ${article ? 'update' : 'create'} article.`);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground/80">Title</label>
            <input
              type="text"
              id="title"
              {...register('title', { required: 'Title is required' })}
              className="mt-1 block w-full rounded-md border-secondary bg-background p-2"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-foreground/80">Slug</label>
            <input
              type="text"
              id="slug"
              {...register('slug', { required: 'Slug is required' })}
              className="mt-1 block w-full rounded-md border-secondary bg-background p-2"
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground/80">Content</label>
            <Controller
              name="content"
              control={control}
              rules={{ required: 'Content is required' }}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  value={field.value}
                  onChange={(content, delta, source, editor) => {
                    field.onChange(content);
                    quillRef.current = editor;
                  }}
                  onBlur={field.onBlur}
                  modules={modules}
                  className="mt-1 bg-background"
                />
              )}
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
          </div>
        </div>

        <div className="space-y-8">
          {/* Featured Image */}
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-foreground/80">Featured Image URL</label>
            <input
              type="text"
              id="featuredImage"
              {...register('featuredImage')}
              className="mt-1 block w-full rounded-md border-secondary bg-background p-2"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* SEO Settings */}
          <div className="space-y-4 rounded-md border border-secondary p-4">
            <h3 className="text-lg font-medium">SEO Settings</h3>
            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-foreground/80">Meta Title</label>
              <input
                type="text"
                id="metaTitle"
                {...register('metaTitle')}
                className="mt-1 block w-full rounded-md border-secondary bg-background p-2"
              />
            </div>
            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-foreground/80">Meta Description</label>
              <textarea
                id="metaDescription"
                rows={3}
                {...register('metaDescription')}
                className="mt-1 block w-full rounded-md border-secondary bg-background p-2"
              />
            </div>
          </div>

          {/* Publish */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              {...register('published')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="published" className="ml-2 block text-sm text-foreground">Publish Post</label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Post'}
        </Button>
      </div>
    </form>
  );
}