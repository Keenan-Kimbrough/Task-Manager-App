from django.contrib import admin

from .models import Todo


class ToDoAdmin(admin.ModelAdmin):
    list_dispaly = ("title", "description", "completed") 

# Register Model

admin.site.register(Todo, ToDoAdmin)
