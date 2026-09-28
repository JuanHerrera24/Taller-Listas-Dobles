class Node:

    def __init__(self, product):
        self.product = product
        self.previous = None
        self.next = None


class DoublyLinkedList:

    def __init__(self):
        self.head = None
        self.tail = None

    def add(self, product):
        new_node = Node(product)

        if self.head is None:
            self.head = new_node
            self.tail = new_node
            return True

        new_node.previous = self.tail
        self.tail.next = new_node
        self.tail = new_node

        return True

    def get_all(self):
        products = []
        current = self.head

        while current is not None:
            products.append(current.product)
            current = current.next

        return products

    def get_reverse(self):
        products = []
        current = self.tail

        while current is not None:
            products.append(current.product)
            current = current.previous

        return products

    def search(self, code):
        current = self.head

        while current is not None:

            if current.product["code"] == code:
                return current.product

            current = current.next

        return None

    def delete(self, code):
        current = self.head

        while current is not None:

            if current.product["code"] == code:

                if current.previous is None:
                    self.head = current.next
                else:
                    current.previous.next = current.next

                if current.next is None:
                    self.tail = current.previous
                else:
                    current.next.previous = current.previous

                return True

            current = current.next

        return False

    def count(self):
        total = 0
        current = self.head

        while current is not None:
            total += 1
            current = current.next

        return total
