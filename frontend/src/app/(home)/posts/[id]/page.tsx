import { AuthorSidebar } from '@/components/author-sidebar';
import { BackButton } from '@/components/posts/back-button';
import CommentItem from '@/components/posts/comment-item';
import { PostDetailContent } from '@/components/posts/post-detail-content';

// Mock data - in a real app, this would come from a database
const posts = [
    {
        id: 1,
        author: {
            name: 'Golanginya',
            username: '@Golanginya',
            avatar: '/developer-avatar.png',
            reputation: 125,
            badges: 8,
            socialLinks: {
                github: '#',
                instagram: '#',
                facebook: '#',
            },
        },
        comments: 2,
        likes: 34,
        timestamp: '12 November 2020 19:35',
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
        tags: ['java', 'javascript'],
    },
    {
        id: 2,
        author: {
            name: 'Linuxoid',
            username: '@Linuxoid',
            avatar: '/programmer-avatar.png',
            reputation: 98,
            badges: 5,
            socialLinks: {
                github: '#',
                instagram: '#',
                facebook: '#',
            },
        },
        comments: 2,
        likes: 34,
        timestamp: '10 November 2020 14:22',
        title: 'What is a difference between Java nad JavaScript?',
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae etiam lectus amet enim.',
        "codeBlock"console.log("Hello World");"endCodeBlock",
        This is a common question for beginners in programming.`,
        tags: ['java', 'javascript', 'wtf'],
    },
];

const comments = [
    {
        id: 1,
        author: {
            name: 'Golanginya',
            avatar: '/developer-avatar.png',
        },
        timeAgo: '5 min ago',
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat aliquet maecenas ut sit nulla',
        likes: 125,
        replies: 15,
        nested: [
            {
                id: 2,
                author: {
                    name: 'Linuxoid',
                    avatar: '/programmer-avatar.png',
                },
                timeAgo: '3 min ago',
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
                likes: 125,
                replies: 15,
            },
        ],
    },
    {
        id: 3,
        author: {
            name: 'Golanginya',
            avatar: '/developer-avatar.png',
        },
        timeAgo: '5 min ago',
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
        likes: 125,
        replies: 15,
        nested: [],
    },
];

export default async function PostDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    console.log(await params);
    return (
        <div className="w-[calc[100%-42rem] flex justify-center">
            <div className="flex flex-col gap-6 max-w-4xl w-full">
                <div className="space-y-2">
                    {/* Back Button */}
                    <div>
                        <BackButton />
                    </div>
                    {/* Post Content */}
                    <PostDetailContent post={posts[0]} />
                    {/* Comments Section */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold">Comment</h2>
                        {comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </section>
                </div>
            </div>
            {/* Sidebar */}
            <div className="w-84 fixed top-24 right-0 md:block hidden">
                <AuthorSidebar author={posts[0].author} />
            </div>
        </div>
    );
}
