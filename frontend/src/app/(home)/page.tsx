import { FilterTabs } from '@/components/filter-tabs';
import { PostCard } from '@/components/posts/post-card';
import { Sidebar } from '@/components/sidebar';

const mock_posts = [
    {
        id: 1,
        author: {
            name: 'Golanginya',
            avatar: '/developer-avatar.png',
        },
        createdAt: new Date().toISOString(),
        title: 'How to patch KDE on FreeBSD?',
        content: `# Tiêu đề Chính (H1)

Chào mừng bạn đến với ví dụ kiểm tra Markdown!

---

## 🚀 Khối Code Block và Inline Code (H2)

Chúng ta hãy xem cách Markdown xử lý khối mã (code block) và mã inline.

Đây là một đoạn mã **inline** đơn giản: \`const x = 10;\`. Bạn có thể sử dụng nó để làm nổi bật tên biến hoặc lệnh nhỏ.

Để hiển thị một **khối code block** lớn hơn, hãy sử dụng ba dấu backtick (\`\`\`).

\`\`\`javascript
// Ví dụ về một function trong JavaScript
function calculateSum(a, b) {
  // Console log là một lệnh thông thường
  console.log("Tính tổng...");
  
  // Trả về kết quả
  return a + b;
}

const result = calculateSum(5, 7);
console.log(\`Kết quả: \${result}\`); // Kết quả sẽ là 12
\`\`\`

---

## 🖼️ Hình ảnh và Liên kết (H2)

Markdown cho phép nhúng hình ảnh và tạo liên kết một cách dễ dàng.

**Liên kết:**
Bạn có thể truy cập trang web của Google [tại đây](https://www.google.com).

**Hình ảnh:**
Đây là một hình ảnh mẫu (hãy đảm bảo URL hình ảnh này có thể truy cập được trong ứng dụng của bạn):

![Logo React](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png)

---

## 📝 Danh sách và Định dạng (H2)

### Danh sách Không Thứ Tự (H3)

* Mục danh sách đầu tiên
* Mục thứ hai (có **in đậm** và *in nghiêng*)
    * Mục con 1
    * Mục con 2

### Danh sách Có Thứ Tự (H3)

1.  Bước khởi tạo
2.  Bước cấu hình môi trường
3.  Bước kiểm tra cuối cùng

### Bảng (Sử dụng remark-gfm)

| Tên Thuộc tính | Kiểu dữ liệu | Bắt buộc |
| :--- | :--- | :--- |
| \`id\` | \`number\` | Yes |
| \`title\` | \`string\` | Yes |
| \`status\` | \`string\` | No |`,
        tags: ['golang', 'linux', 'interface'],
        views: 125,
        comments: 15,
        likes: 155,
    },
    {
        id: 2,
        author: {
            name: 'Linuxoid',
            avatar: '/programmer-avatar.png',
        },
        createdAt: new Date().toISOString(),
        title: 'What is a difference between Java nad JavaScript?',
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae etiam lectus amet enim.',
        tags: ['java', 'javascript', 'wtf'],
        views: 126,
        comments: 15,
        likes: 155,
    },
    {
        id: 3,
        author: {
            name: 'AizhanMaratovna',
            avatar: '/woman-developer.png',
        },
        createdAt: new Date().toISOString(),
        title: 'I want to study Svelte JS Framework. What is the best resourse should I use?',
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat aliquet maecenas ut sit nulla',
        tags: ['svelte', 'javascript', 'recommendation'],
        views: 125,
        comments: 15,
        likes: 155,
    },
    {
        id: 4,
        author: {
            name: 'Lola',
            avatar: '/female-coder.jpg',
        },
        createdAt: new Date().toISOString(),
        title: 'Best practices for React hooks in 2024?',
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat aliquet maecenas ut sit nulla',
        tags: ['react', 'hooks', 'best-practices'],
        views: 342,
        comments: 28,
        likes: 201,
    },
    {
        id: 5,
        author: {
            name: 'Lola',
            avatar: '/female-coder.jpg',
        },
        createdAt: new Date('2025-10-02T04:08:55.064Z').toISOString(),
        title: 'Best practices for React hooks in 2024?',
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat aliquet maecenas ut sit nulla',
        tags: ['react', 'hooks', 'best-practices'],
        views: 342,
        comments: 28,
        likes: 201,
    },
];

export default function Home() {
    return (
        <div className="w-[calc[100%-42rem] flex justify-center">
            <div className="flex flex-col gap-6 max-w-4xl w-full">
                {/* Main Content */}
                <FilterTabs />
                <div className="space-y-4">
                    {mock_posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
            {/* Sidebar */}
            <div className="w-84 fixed top-24 right-0 md:block hidden">
                <Sidebar />
            </div>
        </div>
    );
}
